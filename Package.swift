// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorEmarsysPlugin",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapacitorEmarsysPlugin",
            targets: ["EmarsysPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "EmarsysPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/EmarsysPlugin"),
        .testTarget(
            name: "EmarsysPluginTests",
            dependencies: ["EmarsysPlugin"],
            path: "ios/Tests/EmarsysPluginTests")
    ]
)