//
//  AccountRouter.swift
//  AccountPackageDescription
//
//  Created by 徐鵬鈞 on 2017/12/6.

import Vapor
import MongoKitten
import JWT
import Foundation

class AccountRouter {
    init(_ group: RouteGroup) {
        group.get(Account.parameter) { (request: Request) -> String in
            let account = try request.parameter(Account.self)
            
            guard let mongo = try? request.make(MongoKitten.Server.self) else {
                return "Server connecntion error"
            }
            let database = mongo["Account"]["User"]// choose the database

            let Entity: Document = (try database.findOne("account" == account.identifier))! // 對user 進行其紀錄之尋找
            
            return "Hello " + (Entity["nickname"] as! String)
        }
        
        group.group("records") { _ = RecordRouter($0) }
        group.group("info") { _ = InfoRouter($0) }
        group.group("user") { _ = UserRouter($0) }
    }
}

public func getSigner() -> JWTSigner {
    return JWTSigner.hs512(key: Data("secret".utf8))
}

public func getAccount(token: String) throws -> String {
    let token = token
    let signer = getSigner()
    let access = try JWT<AccountToken>.init(from: token, verifiedUsing: signer)
    return access.payload.username as String!
}

/*
 * + 人（隱性）
 * |--+ 帳號
 *    |-- 交易紀錄
 */


/*
 * + AccountRouter -- ./[user account]  -->  跟你說嗨www 對！就是說嗨而已 完全沒意義的功能
 * |--+ RecordRouter -- ./[user account]/records --> 把你輸入到表單內的資訊記錄到資料庫之中
 * |--+ InfoRouter -- ./[user account]/info --> 取得該使用者的所有金額紀錄(之後可能要新增透過時間等等的條件進行搜尋)
 * + UserRouter
 * |--+ ./user/login --> 登入 對就是單純的登入 如果你的帳號是存在的會回傳給你 token
 * |--+ ./user/signup --> 註冊 沒錯也是單純的註冊 假如不知道註冊是什麼 那我建議你去掛個腦科
 */
