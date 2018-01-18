@_exported import Vapor
import MongoKitten

extension Application {
    public func setup() throws {
        try setupRoutes()
    }
}
