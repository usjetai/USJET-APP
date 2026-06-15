/** Flip to `false` to kill site-wide YouTube background beat. */
export const GLOBAL_BACKGROUND_BEAT_ENABLED = false;

/** Active beat slot — `1` = background beat II only. */
export const GLOBAL_BACKGROUND_BEAT_START_INDEX = 1;

export type GlobalBackgroundBeatTrack = {
  id: string;
  sourceUrl: string;
  label: string;
};

/** Site-wide beat queue — plays in order, then repeats from the top. */
export const GLOBAL_BACKGROUND_BEAT_PLAYLIST: readonly GlobalBackgroundBeatTrack[] = [
  {
    id: "JMGp_VAMsKY",
    sourceUrl: "https://youtu.be/JMGp_VAMsKY?si=RwThNBMgIggRjLog",
    label: "USJET background beat I",
  },
  {
    id: "Co7KJt7rbe8",
    sourceUrl: "https://youtu.be/Co7KJt7rbe8?si=Zf6CZmrq7BBrTYIw",
    label: "USJET background beat II",
  },
] as const;

export const GLOBAL_BACKGROUND_BEAT_VIDEO_ID = GLOBAL_BACKGROUND_BEAT_PLAYLIST[0].id;

export const GLOBAL_BACKGROUND_BEAT_SOURCE_URL = GLOBAL_BACKGROUND_BEAT_PLAYLIST[0].sourceUrl;

export const GLOBAL_BACKGROUND_BEAT_LABEL = GLOBAL_BACKGROUND_BEAT_PLAYLIST[GLOBAL_BACKGROUND_BEAT_START_INDEX].label;

export function getGlobalBackgroundBeatVideoId(index: number): string {
  const track = GLOBAL_BACKGROUND_BEAT_PLAYLIST[index % GLOBAL_BACKGROUND_BEAT_PLAYLIST.length];
  return track?.id ?? GLOBAL_BACKGROUND_BEAT_PLAYLIST[0].id;
}

export function getActiveGlobalBackgroundBeatVideoId(): string {
  return getGlobalBackgroundBeatVideoId(GLOBAL_BACKGROUND_BEAT_START_INDEX);
}
