import Foundation

extension Data {
    init(hexString: String) {
        let cleaned = hexString.replacingOccurrences(of: " ", with: "")
        var data = Data()
        var index = cleaned.startIndex
        while index < cleaned.endIndex {
            let nextIndex = cleaned.index(index, offsetBy: 2, limitedBy: cleaned.endIndex) ?? cleaned.endIndex
            let byteString = cleaned[index..<nextIndex]
            if let byte = UInt8(byteString, radix: 16) {
                data.append(byte)
            }
            index = nextIndex
        }
        self = data
    }

    var hexString: String {
        return map { String(format: "%02.2hhX", $0) }.joined()
    }
}
