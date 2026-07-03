import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

export default function AuthCallback() {
  useEffect(() => {
    WebBrowser.dismissBrowser?.()?.catch(() => {});
  }, []);

  return null;
}
