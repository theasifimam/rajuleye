import { Redirect } from 'expo-router';

export default function Index() {
  // Initial entry point of the app.
  // Redirects the user to the Onboarding flow to begin their journey.
  return <Redirect href="/onboarding" />;
}
