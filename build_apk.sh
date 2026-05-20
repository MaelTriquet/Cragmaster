cd frontend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export ANDROID_HOME=$HOME/Android
npm run build
npx cap sync
cd android && ./gradlew assembleDebug && cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk release/cragmaster.apk

