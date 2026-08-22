import UIKit
import WebKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    private var webView: WKWebView!
    private let navDelegate = WebNavDelegate()
    private let uiDelegate = WebUIDelegate()
    private let localURL = URL(string: "http://localhost:3000")!
    private let remoteURL = URL(string: "https://fangzhihui88.github.io/yuantou-community/")!
    private var useLocal = true

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = navDelegate
        webView.uiDelegate = uiDelegate
        webView.scrollView.contentInsetAdjustmentBehavior = .always

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = WebViewController(webView: webView)
        window?.makeKeyAndVisible()

        loadLocalFirst()
    }

    private func loadLocalFirst() {
        let req = URLRequest(url: localURL, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 5)
        print("[SceneDelegate] Trying local server: \(localURL)")
        webView.load(req)

        // Fallback timer: if local doesn't respond in 6s, load remote
        DispatchQueue.main.asyncAfter(deadline: .now() + 6) { [weak self] in
            guard let self = self, self.useLocal else { return }
            let currentURL = self.webView.url
            if currentURL == nil || currentURL?.host == "localhost" {
                print("[SceneDelegate] Local server not responding, falling back to GitHub Pages")
                self.useLocal = false
                self.webView.load(URLRequest(url: self.remoteURL))
            }
        }
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }
        webView?.load(URLRequest(url: url))
    }
}

// MARK: - NavigationDelegate

class WebNavDelegate: NSObject, WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("[WKNav] didStart: \(webView.url?.absoluteString ?? "nil")")
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("[WKNav] didFinish: \(webView.url?.absoluteString ?? "nil")")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        let err = error as NSError
        print("[WKNav] didFailProv: \(err.code) — \(webView.url?.absoluteString ?? "nil")")
        // For localhost specifically, try remote
        if webView.url?.host == "localhost" {
            print("[WKNav] localhost failed (\(err.code)), trying remote...")
            let remoteURL = URL(string: "https://fangzhihui88.github.io/yuantou-community/")!
            webView.load(URLRequest(url: remoteURL))
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("[WKNav] didFail: \(error)")
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        decisionHandler(.allow)
    }
}

// MARK: - UIDelegate

class WebUIDelegate: NSObject, WKUIDelegate {
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        print("[JS Alert] \(message)")
        completionHandler()
    }
}

// MARK: - WebViewController

class WebViewController: UIViewController {
    private let webView: WKWebView

    init(webView: WKWebView) {
        self.webView = webView
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
    }
}
