import { isIOS, isAndroid, getIOSVersion, isIOS26OrLater } from './platform';
import { getAssetPath } from './assets';
import { devLog } from './log';
import { getMarkdownStyle } from './markdown';
import { getContentText } from './message';

export {
  getContentText,
  getAssetPath,
  isIOS,
  isAndroid,
  getIOSVersion,
  isIOS26OrLater,
  devLog,
  getMarkdownStyle,
};
