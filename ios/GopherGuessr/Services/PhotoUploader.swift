import Foundation

struct PhotoUploader {
    // TODO: Replace with actual app auth key
    private static let appAuthKey = "YOUR_APP_AUTH_KEY"
    private static let uploadURL = "https://gopher.nimbus.page/api_upload"
    
    static func upload(
        base64: String,
        latitude: Double,
        longitude: Double,
        completion: @escaping (Bool, String?) -> Void
    ) {
        guard let url = URL(string: uploadURL) else {
            completion(false, "Invalid URL")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        
        let fields: [String: String] = [
            "appAuthKey": appAuthKey,
            "name": "TEST FROM IOS APP",
            "campus": "EastBankCore",
            "difficulty": "ONE",
            "indoors": "Yes",
            "base64": base64,
            "latitude": String(latitude),
            "longitude": String(longitude)
        ]
        
        for (key, value) in fields {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n".data(using: .utf8)!)
            body.append("\(value)\r\n".data(using: .utf8)!)
        }
        
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        request.httpBody = body
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(false, error.localizedDescription)
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                completion(false, "Invalid response")
                return
            }
            
            if httpResponse.statusCode == 200 {
                completion(true, nil)
            } else {
                completion(false, "Server error: \(httpResponse.statusCode)")
            }
        }.resume()
    }
}
