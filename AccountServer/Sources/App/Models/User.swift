//
//  Signup.swift
//  App
//
//  Created by Corn on 2017/12/7.
//

import Foundation

enum Gender: String, Codable {
    case male
    case female
    case unknown
}

struct User: Content, Codable {
    var account: String
    var password: String
    var nickname: String
    var email: String
    var gender: Gender
}

