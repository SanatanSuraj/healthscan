import { router, type Href } from 'expo-router';

/**
 * Pop when the stack allows it; otherwise replace so Back never no-ops on iOS
 * (e.g. after cold open, replace, or single-screen stacks).
 */
export function goBackOrReplace(href: Href) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(href);
  }
}
