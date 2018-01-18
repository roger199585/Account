//
//  Record.swift
//  App
//
//  Created by 徐鵬鈞 on 2017/12/6.
//

import Foundation

struct Record: Content {
    var price: Int
    var categorys: [String]
    var income: Bool
    var date: Date?
    var remark: String
    
    init(price: Int, categorys: [String], income: Bool, remark: String = "") {
        self.price = price
        self.categorys = categorys
        self.income = income
        self.remark = remark
    }
}
