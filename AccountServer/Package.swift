// swift-tools-version:4.0

import PackageDescription

let package = Package(
    name: "Account",
    products: [
        .library(name: "App", targets: ["App"]),
        .executable(name: "Run", targets: ["Run"])
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/vapor.git", .upToNextMajor(from: "3.0.0-alpha.12")),
        .package(url: "https://github.com/OpenKitten/MongoKitten.git", from: "4.1.2"),
    ],
    targets: [
        .target(name: "App", dependencies: ["Vapor", "MongoKitten", "JWT"], 
                exclude: [
                    "Config",
                    "Public",
                    "Resources",
                ]),
        .target(name: "Run", dependencies: ["App"]),
        .testTarget(name: "AppTests", dependencies: ["App"])
        
    ]
)

