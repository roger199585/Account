import Vapor
import MongoKitten

extension Application {
    func setupRoutes() throws {
        let router = try make(Router.self)
        router.group("") { _ = AccountRouter($0) }
    }
}
