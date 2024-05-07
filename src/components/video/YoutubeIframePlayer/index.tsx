import * as React from 'react';

enum YoutubeIFramePlayerURL {
  PUBLIC = 'https://www.youtube.com/embed/',
  PRIVATE = 'https://www.youtube-nocookie.com/embed/',
}

export interface IYoutubeIframePlayerProps {
  videoId: string;
  className?: string;
  /** default true */
  privacyMode?: boolean;
  /** default 100% */
  width?: string;
  /** default 100% */
  height?: string;
  /** video start time in seconds */
  start?: number;
  /** default false */
  disableControls?: boolean;
  /** default false */
  disableFullscreen?: boolean;
  /** default false */
  autoplay?: boolean;
}

/**
 * YoutubeIframePlayer component
 *
 * Youtube Docs - IFrame Player API
 * https://developers.google.com/youtube/iframe_api_reference
 *
 * @param {IYoutubeIframePlayerProps} props
 */
export const YoutubeIframePlayer: React.FunctionComponent<IYoutubeIframePlayerProps> = ({
  videoId,
  className = 'w-full aspect-video hover:aspect-square',
  privacyMode = false,
  width = '100%',
  height = '100%',
  start = 0,
  disableControls = false,
  disableFullscreen = false,
  autoplay = false,
}) => {
  const playerControls: string[] = [];
  if (autoplay) {
    playerControls.push('autoplay=1');
  }
  if (disableControls) {
    playerControls.push('controls=0');
  }
  if (disableFullscreen) {
    playerControls.push('fs=0');
  }
  if (start > 0) {
    playerControls.push(`start=${start}`);
  }
  const playerControlsStr = playerControls.length > 0 ? `?${playerControls.join('&')}` : '';

  const iframeProps = {
    className,
    src: `${
      privacyMode ? YoutubeIFramePlayerURL.PRIVATE : YoutubeIFramePlayerURL.PUBLIC
    }${videoId}${playerControlsStr}`,
    frameBorder: '0',
    allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
    width,
    height,
  };

  return <iframe title="YoutubeIframePlayer" {...iframeProps} />;
};

export default YoutubeIframePlayer;
