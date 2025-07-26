package migrant.test.khiva;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        myWebView = findViewById(R.id.webview);
        myWebView.setWebViewClient(new WebViewClient());
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.loadUrl("file:///android_asset/index.html");

        // Используем современный OnBackPressedDispatcher
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (myWebView.canGoBack()) {
                    myWebView.goBack();
                } else {
                    showExitDialog();
                }
            }
        });
    }

    private void showExitDialog() {
        new AlertDialog.Builder(this)
                .setTitle("Выход")
                .setMessage("Вы действительно хотите выйти из приложения?")
                .setPositiveButton("Да", (dialog, which) -> finish())
                .setNegativeButton("Нет", null)
                .show();
    }
}
