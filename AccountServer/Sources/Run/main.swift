import App
import MongoKitten
import Foundation

var config = Config()
config.prefer(ConsoleLogger.self, for: Logger.self)

var services = Services.default()
services.register(MongoKitten.Server.self) { container in
    return try Server("mongodb://localhost:27017")
}
services.register { container -> MiddlewareConfig in
    var config = MiddlewareConfig()
    config.use(FileMiddleware.self)
    config.use(DateMiddleware.self)
    config.use(ErrorMiddleware.self)
    config.use(CORSMiddleware(configuration: CORSMiddleware.Configuration.default))
    return config
}

var jsonDecoder = JSONDecoder()
var jsonEncoder = JSONEncoder()

if #available(OSX 10.12, *) {
    jsonDecoder.dateDecodingStrategy = .iso8601
    jsonEncoder.dateEncodingStrategy = .iso8601
}

var customJsonStrategy = ContentConfig.default()
customJsonStrategy.use(decoder: jsonDecoder, for: .json)
customJsonStrategy.use(encoder: jsonEncoder, for: .json)

services.register(ContentConfig.self, customJsonStrategy)

var drop = try Application(config: config, services: services)
try drop.setup()
try drop.run()
