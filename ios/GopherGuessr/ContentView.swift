import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }
            
            TakePhotoView()
                .tabItem {
                    Image(systemName: "camera.fill")
                    Text("Take Picture")
                }
        }
        .tint(.blue)
    }
}

#Preview {
    ContentView()
}
