//
//  RecordRouter.swift
//  App
//
//  Created by 徐鵬鈞 on 2017/12/6.
//

import Vapor
import Foundation
import MongoKitten
import JWT

class RecordRouter {
    init(_ group: RouteGroup) {
        // 記錄該使用者 所輸入之資料
        group.post() { (request: Request) -> AnyResponse in
            let token = request.headers["Authorization"] as String!
            let account = try getAccount(token: token!)
            let inputs = try request.content.decode(Record.self) // get datas
            
            guard let mongo = try? request.make(MongoKitten.Server.self) else {
                return .init(["error": "連線錯誤，請聯絡開發人員"])
            }
            let database = mongo["Account"]["Records"]// choose the database
            
            let document: Document = [
                "account": account,
                "price": inputs.price,
                "categorys": inputs.categorys,
                "date": Date(),
                "income": inputs.income,
                "remark": inputs.remark
            ]
            _ = try database.insert(document)
            
            return .init(["success": "成功加入新的帳目"])
        }
    }
}
