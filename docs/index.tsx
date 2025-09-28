import React from 'react';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout title="Welcome to Znuny Docs" description="Documentation for Znuny setup and customization">
      <main style={{ padding: '2rem' }}>
        <h1>Welcome to teh Squiirels </h1>
        <p>This site contains guides, setup instructions, and customization tips for Znuny.</p>

        <section>
          <h2>🔧 Dynamic Fields</h2>
          <p>Learn how to create, manage, and use dynamic fields in Znuny to customize your ticket workflows.</p>
          <a href="/docs/dynamic-fields">Explore Dynamic Fields →</a>
        </section>

         <section>
          <h2> ^=^t  Accounts Setup</h2>
          <p>Learn how the accounts work with Znuny</p>
          <a href="/docs/dynamic-fields">Explore Dynamic Fields  ^f^r</a>
        </section>
      </main>
    </Layout>
  );
}
