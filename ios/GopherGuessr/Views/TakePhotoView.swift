import SwiftUI
import AVFoundation
import CoreLocation

struct TakePhotoView: View {
    @StateObject private var cameraManager = CameraManager()
    @StateObject private var locationManager = LocationManager()
    @State private var uploadState: UploadState = .idle
    
    enum UploadState {
        case idle
        case uploading
        case success
        case error(String)
    }
    
    var body: some View {
        ZStack {
            if cameraManager.permissionGranted {
                CameraPreviewView(session: cameraManager.session)
                    .edgesIgnoringSafeArea(.all)
                
                VStack {
                    // Status banner
                    statusBanner
                    
                    Spacer()
                    
                    // Capture button
                    Button(action: captureAndUpload) {
                        Text("Upload!")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 40)
                            .padding(.vertical, 16)
                            .background(Color.blue.opacity(0.8))
                            .clipShape(Capsule())
                    }
                    .disabled(uploadState == .uploading)
                    .padding(.bottom, 80)
                }
            } else {
                VStack(spacing: 16) {
                    Text("We need your permission to show the camera")
                        .multilineTextAlignment(.center)
                        .padding()
                    
                    Button("Grant Permission") {
                        cameraManager.requestPermission()
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
        }
        .onAppear {
            cameraManager.checkPermission()
            locationManager.requestPermission()
        }
    }
    
    @ViewBuilder
    private var statusBanner: some View {
        switch uploadState {
        case .success:
            Text("Uploaded successfully!")
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(.green)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.green.opacity(0.3))
        case .uploading:
            Text("Uploading...")
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(.blue)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.blue.opacity(0.3))
        case .error(let message):
            Text("Error: \(message)")
                .font(.headline)
                .foregroundColor(.red)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.red.opacity(0.3))
        case .idle:
            EmptyView()
        }
    }
    
    private func captureAndUpload() {
        uploadState = .uploading
        
        cameraManager.capturePhoto { imageData in
            guard let imageData = imageData else {
                uploadState = .error("Failed to capture photo")
                return
            }
            
            // Resize image to reduce upload size
            guard let image = UIImage(data: imageData),
                  let resizedImage = resizeImage(image, targetWidth: 500),
                  let jpegData = resizedImage.jpegData(compressionQuality: 0.8) else {
                uploadState = .error("Failed to process image")
                return
            }
            
            let base64String = jpegData.base64EncodedString()
            let location = locationManager.currentLocation
            
            PhotoUploader.upload(
                base64: base64String,
                latitude: location?.coordinate.latitude ?? 0,
                longitude: location?.coordinate.longitude ?? 0
            ) { success, error in
                DispatchQueue.main.async {
                    if success {
                        uploadState = .success
                    } else {
                        uploadState = .error(error ?? "Unknown error")
                    }
                }
            }
        }
    }
    
    private func resizeImage(_ image: UIImage, targetWidth: CGFloat) -> UIImage? {
        let scale = targetWidth / image.size.width
        let targetHeight = image.size.height * scale
        let size = CGSize(width: targetWidth, height: targetHeight)
        
        UIGraphicsBeginImageContextWithOptions(size, false, 1.0)
        image.draw(in: CGRect(origin: .zero, size: size))
        let resizedImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return resizedImage
    }
}

// MARK: - Camera Manager

class CameraManager: NSObject, ObservableObject {
    @Published var permissionGranted = false
    let session = AVCaptureSession()
    private let photoOutput = AVCapturePhotoOutput()
    private var photoCompletion: ((Data?) -> Void)?
    
    func checkPermission() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            permissionGranted = true
            setupCamera()
        case .notDetermined:
            requestPermission()
        default:
            permissionGranted = false
        }
    }
    
    func requestPermission() {
        AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
            DispatchQueue.main.async {
                self?.permissionGranted = granted
                if granted {
                    self?.setupCamera()
                }
            }
        }
    }
    
    private func setupCamera() {
        session.beginConfiguration()
        
        guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
              let input = try? AVCaptureDeviceInput(device: camera) else {
            return
        }
        
        if session.canAddInput(input) {
            session.addInput(input)
        }
        
        if session.canAddOutput(photoOutput) {
            session.addOutput(photoOutput)
        }
        
        session.commitConfiguration()
        
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            self?.session.startRunning()
        }
    }
    
    func capturePhoto(completion: @escaping (Data?) -> Void) {
        photoCompletion = completion
        let settings = AVCapturePhotoSettings()
        photoOutput.capturePhoto(with: settings, delegate: self)
    }
}

extension CameraManager: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        guard error == nil, let data = photo.fileDataRepresentation() else {
            photoCompletion?(nil)
            return
        }
        photoCompletion?(data)
    }
}

// MARK: - Location Manager

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    @Published var currentLocation: CLLocation?
    
    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    func requestPermission() {
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        currentLocation = locations.last
    }
}

// MARK: - Camera Preview View

struct CameraPreviewView: UIViewRepresentable {
    let session: AVCaptureSession
    
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        
        DispatchQueue.main.async {
            previewLayer.frame = view.bounds
        }
        
        return view
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
        if let layer = uiView.layer.sublayers?.first as? AVCaptureVideoPreviewLayer {
            layer.frame = uiView.bounds
        }
    }
}

#Preview {
    TakePhotoView()
}
