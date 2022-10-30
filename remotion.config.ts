import {Config} from 'remotion';
import {webpackOverride} from './src/webpack-override';

Config.Rendering.setImageFormat('jpeg');
Config.Output.setOverwriteOutput(true);
Config.Output.setVideoBitrate('200k');
Config.Output.setAudioBitrate('32k');

Config.Bundling.overrideWebpackConfig(webpackOverride);
