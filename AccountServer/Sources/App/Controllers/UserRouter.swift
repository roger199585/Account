//
//  SignupRouter.swift
//  App
//
//  Created by 徐鵬鈞 on 2017/12/7.
//

import Vapor
import JWT
import Foundation
import MongoKitten

class UserRouter {
    init(_ group: RouteGroup) {
        // 註冊驗證
        group.post("signup") { (request: Request) -> Future<[String:String]> in
            let newUser = try request.content.decode(User.self) // get the data in the table on the UI
            if newUser.account == "" {
                return .init(["error": "智障會不會打字啊？"])
            }
            
            guard let mongo = try? request.make(MongoKitten.Server.self) else {
                return .init(["error": "Connection error"])
            }
            let database = mongo["Account"]["User"]// choose the database
            
            if let _ = try database.findOne("email" == newUser.email) {
                if let _ = try database.findOne("account" == newUser.account) {
                    return .init(["error": "沒救了...沒救了..."])
                }
                else {
                    return .init(["error": "臭智障！！這個Email已經被用過了，你是不是忘記自己註冊過了？"])
                }
            }
            else {
                if let _ = try database.findOne("account" == newUser.account) {
                    return .init(["error": "臭87！！這個帳號早就被用過了，有點創意好嗎？"])
                }
                else {
                    let document: Document = [
                        "account": newUser.account,
                        "password": newUser.password,
                        "nickname": newUser.nickname,
                        "email": newUser.email,
                        "gender": String(describing: newUser.gender)
                    ]
                    _ = try database.insert(document) // insert document into DB
                    return .init(["success": "註冊成功"])
                }
            }
        }
        
        // 登入驗證
        group.post("login") { (request: Request) -> Future<[String:String]> in //
            let user = try request.content.decode(Member.self)
            var mongo: MongoKitten.Server! = nil
            do {
                mongo = try request.make(MongoKitten.Server.self) //return "Connection error: 500"
            } catch {
                print(error.localizedDescription)
            }
            let database = mongo["Account"]["User"]// choose the database
            
            // find if the account is in the DB
            if let userEntity = try database.findOne("account" == user.account || "email" == user.account) {
                if String(userEntity["password"]) != user.password {
                    return .init(["error": "你是不是忘記密碼了，87"])
                } else {
                    let signer = getSigner() // 將我們的簽名進行加密
                    // 生成我們的JWT token 限制token 存在時間為一天 username = 使用者帳號
                    var token = JWT<AccountToken>.init(payload: AccountToken(exp: ExpirationClaim(value: Date().addingTimeInterval(86400)), username: user.account))
                    let signed = try! signer.sign(&token)
                    return .init(["token": String(data: signed, encoding: .utf8)!])
                    // 等同於回傳 Future<[String: String]>.init(["token": String(data: signed, encoding: .utf8)!])
                    // String(data: signed, encoding: .utf8)! 將 signed 以utf8隻文字編碼轉換成字串
                }
            } else {
                return .init(["error": "志朗，先註冊好嗎？"])
            }
        }
        
        group.post("update") { (request: Request) -> Future<[String:String]> in
            let newUser = try request.content.decode(User.self) // get the data in the table on the UI
            
            guard let mongo = try? request.make(MongoKitten.Server.self) else {
                return .init(["error": "Connection error"])
            }
            let database = mongo["Account"]["User"]// choose the database
            
            
            
            if let _ = try database.findOne("email" == newUser.email && "account" != newUser.account) {
                return .init(["error": "臭智障！！這個Email已經被用過了!不可以更新成這個"])
            }
            else {
                let document: Document = [
                    "account": newUser.account,
                    "password": newUser.password,
                    "nickname": newUser.nickname,
                    "email": newUser.email,
                    "gender": String(describing: newUser.gender)
                ]
                _ = try database.update("account" == newUser.account, to: document) // insert document into DB
                return .init(["success": "更新成功"])
            }
        }
        
        group.get("info") { (request: Request) -> [Document] in
            
            var mongo: MongoKitten.Server! = nil
            do {
                mongo = try request.make(MongoKitten.Server.self) //return "Connection error: 500"
            } catch {
                print(error.localizedDescription)
            }
            let database = mongo["Account"]["User"]// choose the database
            
            let token = request.headers["Authorization"] as String!
            let account = try getAccount(token: token!) // get account
            
            if let userDetail: Document = try database.findOne("account" == account) {
                return [userDetail]
            }
            else {
                let document: Document = [
                "error": "Can't find the account's detail"
                ]
                return [document]
            }
        }
    }
}

extension Dictionary: ResponseEncodable {
    public func encode(to res: inout Response, for req: Request) throws -> Future<Void> {
        try res.content.encode(self, as: MediaType.json) // 將我們丟進來的資料res轉換稱json的形式回傳
        
        return Future.done
    }
}
