# SPDX-License-Identifier: GPL-3.0-only
# Cragmaster - climbing topo manager
# Copyright (C) 2026  mtriquet
cd frontend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export ANDROID_HOME=$HOME/Android
npm run build
npx cap sync
cd android && ./gradlew assembleDebug && cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk release/cragmaster.apk

