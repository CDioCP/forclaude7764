import React from 'react';

export default function LegalPages({ page, onBack }) {
    const containerStyle = {
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'var(--bg-panel)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        color: '#e0e0e0',
        textAlign: 'left',
        lineHeight: '1.7'
    };

    const headerStyle = {
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const renderContent = () => {
        switch (page) {
            case 'terms':
                return (
                    <>
                        <h3 style={{ color: '#fff', marginTop: 0 }}>Terms & Conditions</h3>
                        <p><strong>Last updated: March 2026</strong></p>

                        <p>Welcome to Vocab Memory Quest. By using our application, you agree to these Terms & Conditions.</p>

                        <p><strong>The Merchant of Record for this website is Dionisio Carvajal.</strong></p>

                        <h4 style={{ color: '#fff' }}>Subscription & Free Trial</h4>
                        <p>
                            Your subscription starts with a <strong>30-day free trial</strong>. After the trial,
                            a monthly fee of <strong>$1.99</strong> will be charged automatically to your payment
                            method on file. You may cancel at any time before the trial ends to avoid being charged.
                        </p>
                        <p>
                            Billing is handled securely by <strong>Paddle.com</strong>, our authorized payment
                            processor. By starting a trial, you authorize Paddle to charge $1.99/month after the
                            30-day free trial period ends.
                        </p>

                        <h4 style={{ color: '#fff' }}>Free Tier</h4>
                        <p>
                            A free tier is available with access to A1 and A2 vocabulary levels and a 3-heart
                            daily limit. No payment is required to use the free tier.
                        </p>

                        <h4 style={{ color: '#fff' }}>Premium Tier</h4>
                        <p>
                            Premium subscribers ($1.99/month after 30-day free trial) receive access to B1, B2,
                            and C1 vocabulary levels, unlimited hearts, and an ad-free experience.
                        </p>

                        <h4 style={{ color: '#fff' }}>Content & Use</h4>
                        <p>
                            All content within this application is provided for educational purposes. You agree
                            not to reproduce, distribute, or exploit any content from this application without
                            prior written permission.
                        </p>

                        <h4 style={{ color: '#fff' }}>Account</h4>
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials.
                            We reserve the right to terminate accounts that violate these terms.
                        </p>

                        <h4 style={{ color: '#fff' }}>Contact</h4>
                        <p>
                            For any questions regarding these Terms, contact us at{' '}
                            <a href="mailto:dionisio.carvajal@gmail.com" style={{ color: 'var(--purple-bright)' }}>
                                dionisio.carvajal@gmail.com
                            </a>.
                        </p>
                    </>
                );

            case 'privacy':
                return (
                    <>
                        <h3 style={{ color: '#fff', marginTop: 0 }}>Privacy Policy</h3>
                        <p><strong>Last updated: March 2026</strong></p>

                        <p>
                            Your privacy is important to us. This policy explains what data we collect and how
                            we use it.
                        </p>

                        <h4 style={{ color: '#fff' }}>Data We Collect</h4>
                        <ul>
                            <li>
                                <strong>Authentication data:</strong> We use Google OAuth for sign-in. We receive
                                your name, email address, and profile photo from Google.
                            </li>
                            <li>
                                <strong>Learning progress:</strong> We store your vocabulary progress, game history,
                                and subscription status in Firebase Firestore to provide a personalized experience.
                            </li>
                            <li>
                                <strong>Payment data:</strong> Payments are processed by Paddle.com. We do not
                                store your credit card or payment details on our servers.
                            </li>
                        </ul>

                        <h4 style={{ color: '#fff' }}>How We Use Your Data</h4>
                        <ul>
                            <li>To authenticate you and maintain your session.</li>
                            <li>To track your vocabulary learning progress using spaced repetition.</li>
                            <li>To manage your subscription status and unlock premium features.</li>
                        </ul>

                        <h4 style={{ color: '#fff' }}>Data We Do NOT Collect or Sell</h4>
                        <p>
                            <strong>We do not sell your vocabulary progress or neural data.</strong> We do not
                            share your personal information with third parties for advertising or marketing purposes.
                        </p>

                        <h4 style={{ color: '#fff' }}>Data Retention</h4>
                        <p>
                            Your data is retained as long as your account is active. You may request deletion
                            of your data at any time by contacting us.
                        </p>

                        <h4 style={{ color: '#fff' }}>Third-Party Services</h4>
                        <ul>
                            <li><strong>Firebase (Google):</strong> Authentication and database.</li>
                            <li><strong>Paddle.com:</strong> Payment processing for the $1.99/month subscription.</li>
                        </ul>

                        <h4 style={{ color: '#fff' }}>Contact</h4>
                        <p>
                            For privacy inquiries, contact{' '}
                            <a href="mailto:dionisio.carvajal@gmail.com" style={{ color: 'var(--purple-bright)' }}>
                                dionisio.carvajal@gmail.com
                            </a>.
                        </p>
                    </>
                );

            case 'refund':
                return (
                    <>
                        <h3 style={{ color: '#fff', marginTop: 0 }}>Refund Policy</h3>
                        <p><strong>Last updated: March 2026</strong></p>

                        <p>We want you to be fully satisfied with Vocab Memory Quest Pro.</p>

                        <h4 style={{ color: '#fff' }}>Free Trial</h4>
                        <p>
                            You can cancel your <strong>$1.99 subscription</strong> at any time during the
                            <strong> 30-day free trial</strong> without any charge. No payment will be collected
                            if you cancel before the trial period ends.
                        </p>

                        <h4 style={{ color: '#fff' }}>After the Trial Period</h4>
                        <p>
                            If you are charged and are not satisfied with your purchase, please contact us within
                            <strong> 14 days</strong> of the charge date and we will issue a full refund, no
                            questions asked.
                        </p>

                        <h4 style={{ color: '#fff' }}>How to Cancel</h4>
                        <p>
                            You can cancel your subscription at any time through your Paddle billing portal.
                            Cancellation takes effect at the end of the current billing period.
                        </p>

                        <h4 style={{ color: '#fff' }}>Contact</h4>
                        <p>
                            To request a refund or cancel your subscription, contact us at{' '}
                            <a href="mailto:dionisio.carvajal@gmail.com" style={{ color: 'var(--purple-bright)' }}>
                                dionisio.carvajal@gmail.com
                            </a>.
                        </p>
                    </>
                );

            default:
                return <p>Page not found.</p>;
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    Legal
                </h2>
                <button
                    onClick={onBack}
                    style={{
                        background: 'rgba(139,92,246,0.12)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    ← Back
                </button>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
}
