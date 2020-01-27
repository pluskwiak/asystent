package com.asystentpacjenta;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import it.innove.BleManagerPackage;
import io.invertase.firebase.RNFirebasePackage;

import com.horcrux.svg.SvgPackage;
import com.reactlibrary.RNFsStreamPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;

import com.rnfs.RNFSPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.polidea.reactnativeble.BlePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new BleManagerPackage(),
            new RNFirebasePackage(),
           // new RNFetchBlobPackage(),
            new SvgPackage(),
            new RNFsStreamPackage(),
            new TextToSpeechPackage(),
            new VectorIconsPackage(),
           // new RNGoogleFirebasePackage()
           new RNFirebaseStoragePackage(),
          // new ReactNativeConfigPackage(),
           // new RNFirebasePackage(),
           //new RNFirebaseDatabasePackage(),
            new RNFSPackage(),
            new LocationServicesDialogBoxPackage(),
            new BlePackage(),
            new RNGestureHandlerPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseFirestorePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage()    

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
