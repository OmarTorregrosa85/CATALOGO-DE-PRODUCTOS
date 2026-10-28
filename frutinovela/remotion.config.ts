import { Config } from "@remotion/cli/config";

// MP4 H.264, listo para YouTube.
Config.setCodec("h264");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(90);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
