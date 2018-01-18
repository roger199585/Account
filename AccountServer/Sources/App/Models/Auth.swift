//
//  Auth.swift
//  App
//
//  Created by Corn on 2017/12/13.
//

import Foundation
import JWT

struct AccountToken: JWTPayload, Codable {
    func verify() throws {
        try exp.verify()
    }
    
    let exp: ExpirationClaim
    let username: String
}
