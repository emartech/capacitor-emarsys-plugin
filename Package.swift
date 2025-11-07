// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorEmarsysPlugin",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapacitorEmarsysPlugin",
            targets: ["examplePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "examplePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/examplePlugin"),
        .testTarget(
            name: "examplePluginTests",
            dependencies: ["examplePlugin"],
            path: "ios/Tests/examplePluginTests")
    ]
)