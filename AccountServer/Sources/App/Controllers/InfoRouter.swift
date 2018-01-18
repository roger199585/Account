//
//  InfoRouter.swift
//  App
//
//  Created by Corn on 2017/12/15.
//

import Vapor
import JWT
import Foundation
import MongoKitten

class InfoRouter {
    init(_ group: RouteGroup) {
        // 取得搜尋資料
        struct Statistics: Codable {
            let incomes: Int
            let expenses: Int
        }
        
        func getInfo(syear: Int, smonth: Int, sday: Int, eyear: Int, emonth: Int, eday: Int, account: String, cate: String, mongo: MongoKitten.Server, all: Bool, permonth: Bool, daily: Bool, category: Bool, extremum: Bool, limit: Int) throws -> AnyResponse {
            let database = mongo["Account"]["Records"]// choose the database
            let account = account // get account
            
            func date(year: Int, month: Int, day: Int) -> Date {
                return DateComponents(calendar: .current, timeZone: TimeZone.init(secondsFromGMT: 0)!, era: nil, year: year, month: month, day: day, hour: 0, minute: 0, second: 0, nanosecond: 0, weekday: nil, weekdayOrdinal: nil, quarter: nil, weekOfMonth: nil, weekOfYear: nil, yearForWeekOfYear: nil).date!
            }
            
            // 取得單日或是單月的總收入以及支出
            if (permonth || daily) && limit == 0 {
                let aqt = permonth ?
                        AQT.and([
                            AQT.valEquals(key: "account", val: account),
                            AQT.greaterThanOrEqual(key: "date", val: date(year: syear, month: smonth, day: 1)),
                            AQT.smallerThan(key: "date", val: date(year: syear, month: smonth, day: 31))
                        ]) :
                        AQT.and([
                            AQT.valEquals(key: "account", val: account),
                            AQT.greaterThanOrEqual(key: "date", val: date(year: syear, month: smonth, day: sday)),
                            AQT.smallerThan(key: "date", val: date(year: syear, month: smonth, day: sday + 1))
                        ])
                
                let allEntities: CollectionSlice<Document> = try database.find(Query.init(aqt: aqt))
                let documents: [Document] = Array(allEntities)
                
                var incomes: Int = 0
                var expenses: Int = 0
                var max_income: Int = 0
                var max_expense: Int = 0
                var max_inc_doc: Document?
                var max_exp_doc: Document?
                
                for document in documents {
                    if document["income"] as! Bool {
                        incomes += document["price"] as! Int
                        if max_income < document["price"] as! Int {
                            max_income = document["price"] as! Int
                            max_inc_doc = document
                        }
                    }
                    else {
                        expenses += document["price"] as! Int
                        if max_expense < document["price"] as! Int {
                            max_expense = document["price"] as! Int
                            max_exp_doc = document
                        }
                    }
                }
                
                struct Response: Codable, ResponseEncodable {
                    func encode(to res: inout Vapor.Response, for req: Request) throws -> Future<Void> {
                        try res.content.encode(self, as: .json)
                        
                        return Future.done
                    }
                    
                    let data: Statistics
                    let extremum_in: Document?
                    let extremum_out: Document?
                }
                
                return .init(Response(data: Statistics(incomes: incomes, expenses: expenses), extremum_in: max_inc_doc, extremum_out: max_exp_doc))
            }
            
            if category {
                let aqt = AQT.and([
                    AQT.valEquals(key: "account", val: account),
                    AQT.in(key: "categorys", in: [cate])
                
                ])
                
                let allEntities: CollectionSlice<Document> = try database.find(Query.init(aqt: aqt))
                let documents: [Document] = Array(allEntities)
                
                let bsonDecoder = BSONDecoder()
                let docs = documents.flatMap { (doc: Document) -> Record? in
                    do {
                        return try bsonDecoder.decode(Record.self, from: doc)
                    } catch {
                        print(error.localizedDescription)
                        return nil
                    }
                }
                return .init(docs)
            }
            
            if limit > 0 {
                if permonth {
                    var count: Int = 6
                    var month: Int = smonth
                    var year: Int = syear
                    var total_income: Int = 0
                    var total_expense: Int = 0
                    var return_docs: Array<[Document]> = []
                    
                    while count > 0 {
                        print("Year:" + String(year))
                        print("Month:" + String(month))
                        
                        let aqt = AQT.and([
                            AQT.valEquals(key: "account", val: account),
                            AQT.greaterThanOrEqual(key: "date", val: date(year: year, month: month, day: 1)),
                            AQT.smallerThan(key: "date", val: date(year: year, month: month, day: 31))
                        ])
                        
                        let allEntities: CollectionSlice<Document> = try database.find(Query.init(aqt: aqt))
                        let documents: [Document] = Array(allEntities)
                        
                        for document in documents {
                            if document["income"] as! Bool {
                                total_income += document["price"] as! Int
                            }
                            else {
                                total_expense += document["price"] as! Int
                            }
                        }
                        
                        let day: String = String(year) + "/" + String(month)
                        let data: Document = [
                            "date": day,
                            "income": total_income,
                            "expense": total_expense
                        ]
                        
                        return_docs.append([data])
                        total_income = 0
                        total_expense = 0
                        
                        month -= 1
                        if month < 1 {
                            year -= 1
                            month = 12
                        }
                        count -= 1
                    }
                        
                        
                        
                    struct Response_permonth: Codable, ResponseEncodable {
                        func encode(to res: inout Vapor.Response, for req: Request) throws -> Future<Void> {
                            try res.content.encode(self, as: .json)
                            
                            return Future.done
                        }
                        
                        let data1: [Document]
                        let data2: [Document]
                        let data3: [Document]
                        let data4: [Document]
                        let data5: [Document]
                        let data6: [Document]
                        
                    }
                    return .init(Response_permonth(data1: return_docs[0], data2: return_docs[1], data3: return_docs[2], data4: return_docs[3], data5: return_docs[4], data6: return_docs[5]))
                    
                    
                } else {
                    let aqt = AQT.and([
                        AQT.valEquals(key: "account", val: account),
                        AQT.greaterThanOrEqual(key: "date", val: date(year: syear, month: smonth, day: 1)),
                        AQT.smallerThan(key: "date", val: date(year: syear, month: smonth, day: 31))
                    ])
                    
                    let allEntities: CollectionSlice<Document> = try database.find(Query.init(aqt: aqt), limitedTo: limit)
                    let documents: [Document] = Array(allEntities)
                    
                    let bsonDecoder = BSONDecoder()
                    let docs = documents.flatMap { (doc: Document) -> Record? in
                        do {
                            return try bsonDecoder.decode(Record.self, from: doc)
                        } catch {
                            print(error.localizedDescription)
                            return nil
                        }
                    }
                    
                    struct Response: Codable, ResponseEncodable {
                        func encode(to res: inout Vapor.Response, for req: Request) throws -> Future<Void> {
                            try res.content.encode(self, as: .json)
                            
                            return Future.done
                        }
                        
                        let data: [Record]
                    }
                    return .init(Response(data: docs))
                }
            }
            return .init(["error": "123"])
        }
        
        group.get() { (request: Request) -> AnyResponse in
            guard let mongo = try? request.make(MongoKitten.Server.self) else {
                let document = [
                    "deipiction": "Server connecntion error",
                    "code": "500"
                ]
                return .init(document)
            }
            
            let token = request.headers["Authorization"] as String!
            let account = try getAccount(token: token!) // get account
            
            let current_month = Calendar.current.component(Calendar.Component.month, from: Date())
            let current_year = Calendar.current.component(Calendar.Component.year, from: Date())
            let current_day = Calendar.current.component(Calendar.Component.day, from: Date())
            
            return try getInfo(
                syear: request.query["syear"] ?? current_year,
                smonth: request.query["smonth"] ?? current_month,
                sday: request.query["sday"] ?? current_day,
                eyear: request.query["eyear"] ?? current_year,
                emonth: request.query["emonth"] ?? current_month,
                eday: request.query["eday"] ?? current_day,
                account: account,
                cate: request.query["cate"] ?? "",
                mongo: mongo,
                all: request.query["all"] ?? false,
                permonth: request.query["permonth"] ?? false,
                daily: request.query["daily"] ?? false,
                category: request.query["category"] ?? false,
                extremum: request.query["extremum"] ?? true,
                limit: request.query["limit"] ?? 0
            )
        }
    }
}



/*
 * localhost:8080?[start_day]&[end_day]&[single]&[all]
 * [start_day]: 起始日期
 * (default: current date)
 *
 * [end_day]: 結束日期
 * (default: current date)
 *
 * all :    取得此帳號的所有帳目(預設是false)
 * permonth: 取得單月資料(預設是false)
 * daily:   取得單日資料(預設是false)
 * category: 取得該類別所有資料(預設是false)
 * extremum:     取得該項資料之最大最小資料(預設是true)
 * limit:   取得limit比近期資料
 *
 *
 * 單月單日格式都是如此
 * Example: http://localhost:8080/info?syear=2018&smonth=1&permonth=true
 * Response: {
 *              "data": {
 *                  "incomes": xxx // 總收入
 *                  "expenses": xxx // 總支出
 *               },
 *              "extremum_out": {
 *                   // 最大筆支出的所有資料
 *              },
 *               "extream_in": {
 *                  // 最大筆收入的所有資料
 *               }
 *           }
 *
 *
 *
 * Example: http://localhost:8080/info?category=true&cate=交通費
 * Response: {
 *              {
 *                  "remark": "blablabla...",
 *                  "categorys": [
 *                      "xxx",
 *                      "blablabla.."
 *                  ],
 *                  "income": (ture/false),
 *                  "price": xxx,
 *                  "date": "2018/1/8......"
 *              }
 *              {
 *                  // 其他銅像花費詳細資料
 *              }
 *           }
 */
