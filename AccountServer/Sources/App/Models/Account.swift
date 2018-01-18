//
//  Account.swift
//  AccountPackageDescription
//
//  Created by 徐鵬鈞 on 2017/12/6.
//  定義模組

import Foundation

class Account : Parameter {
    static func make(for parameter: String, using container: Container) throws -> Account {
        let identifier = parameter.removingPercentEncoding ?? parameter
        return .init(identifier: identifier)
    }
    
    typealias ResolvedParameter = Account
    
    var identifier: String
    
    static var uniqueSlug = "corn:account"
    
    init(identifier: String) {
        self.identifier = identifier
    }
}
