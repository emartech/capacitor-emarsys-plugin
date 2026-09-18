import Foundation
import UIKit
import EmarsysSDK

@objc public class EmarsysInApp: NSObject {
    @objc public func pause() {
        Emarsys.inApp.pause()
    }

    @objc public func resume() {
        Emarsys.inApp.resume()
    }

    @objc public func isPaused() -> Bool {
        return Emarsys.inApp.isPaused()
    }

    public var inlineEventCallback: ((String, String, [String: Any]) -> Void)?

    private var inlineViews: [String: EMSInlineInAppView] = [:]
    private var loadedViews: Set<String> = []

    public func loadInline(viewRef: String, viewId: String, frame: CGRect, zIndex: Int?, webView: UIView?) {
        makeTransparent(webView)

        let isNew: Bool
        let view: EMSInlineInAppView
        if let existing = inlineViews[viewRef] {
            view = existing
            isNew = false
        } else {
            view = EMSInlineInAppView()
            view.eventHandler = { [weak self] name, payload in
                self?.emitInline(viewRef: viewRef, type: "appEvent", data: [
                    "name": name,
                    "payload": EmarsysInApp.normalize(payload)
                ])
            }
            view.completionBlock = { [weak self] error in
                self?.emitInline(viewRef: viewRef, type: "completion", data: [
                    "error": error?.localizedDescription as Any
                ])
            }
            view.closeBlock = { [weak self] in
                self?.emitInline(viewRef: viewRef, type: "close", data: [:])
            }
            inlineViews[viewRef] = view
            isNew = true
        }

        insert(view: view, into: webView, zIndex: zIndex)
        let resolved = offset(frame, by: webView)
        view.frame = resolved
        if isNew || !loadedViews.contains(viewRef) {
            if resolved.width > 0 && resolved.height > 0 {
                loadedViews.insert(viewRef)
                view.loadInApp(viewId: viewId)
            }
        }
    }

    private func emitInline(viewRef: String, type: String, data: [String: Any]) {
        inlineEventCallback?(viewRef, type, data)
    }

    private func offset(_ frame: CGRect, by webView: UIView?) -> CGRect {
        guard let webView = webView else { return frame }
        return frame.offsetBy(dx: webView.frame.origin.x, dy: webView.frame.origin.y)
    }

    private func insert(view: EMSInlineInAppView, into webView: UIView?, zIndex: Int?) {
        guard let superview = webView?.superview else { return }
        if view.superview !== superview {
            view.removeFromSuperview()
            superview.addSubview(view)
        }
        if let zIndex = zIndex {
            reorder(view: view, in: superview, zIndex: zIndex)
        } else {
            superview.bringSubviewToFront(view)
        }
    }

    private func reorder(view: UIView, in superview: UIView?, zIndex: Int) {
        guard let superview = superview else { return }
        view.layer.zPosition = CGFloat(zIndex)
        superview.bringSubviewToFront(view)
    }

    private func makeTransparent(_ webView: UIView?) {
        webView?.isOpaque = false
        webView?.backgroundColor = .clear
        if let scrollView = (webView as? UIScrollView) ?? (webView?.subviews.first as? UIScrollView) {
            scrollView.backgroundColor = .clear
        }
    }

    private static func normalize(_ payload: [AnyHashable: Any]?) -> [String: Any] {
        var normalized: [String: Any] = [:]
        guard let payload = payload else { return normalized }
        for (key, value) in payload {
            if let key = key as? String {
                normalized[key] = value
            }
        }
        return normalized
    }
}
