import React from 'react';
import { Redirect } from 'expo-router';

// This file is deprecated. Redirecting to the new auth entry flow.
export default function DeprecatedAuthScreen() {
  return <Redirect href="/auth-entry" />;
}
