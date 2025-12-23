/** @jsxImportSource react */
import { Logo } from './Logo';

export const SignupEmailCheckTemplate = ({ otp }: { otp: string }) => {
  return (
    <html
      lang="en"
      style={{
        fontFamily:
          'Montserrat, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Verify your email</title>
      </head>
      <body
        style={{
          backgroundColor: '#FBF7FD', // primary-50 approx
          margin: 0,
          padding: '40px 20px',
          lineHeight: '1.6',
          color: '#374151',
        }}
      >
        <table
          width="100%"
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', // Deeper, sleeker shadow
            border: '1px solid #e5e7eb',
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: '48px 40px 32px 40px',
                  textAlign: 'center',
                  background: 'linear-gradient(to bottom, #ffffff, #FBF7FD)', // Subtle gradient fade
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <Logo width={80} height={80} style={{ margin: '0 auto' }} />
                </div>
                <h1
                  style={{
                    color: '#3E1E60', // Primary Brand Color
                    margin: 0,
                    fontSize: '28px',
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Verify Your Identity
                </h1>
                <p
                  style={{
                    margin: '16px 0 0 0',
                    fontSize: '16px',
                    color: '#4b5563',
                    fontWeight: '500',
                  }}
                >
                  Thank you for signing up with EasyResPlus.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style={{
                  backgroundColor: '#FBF7FD',
                  padding: '0 40px 40px 40px',
                }}
              >
                <p
                  style={{
                    margin: '0 0 32px 0',
                    fontSize: '16px',
                    color: '#374151',
                    textAlign: 'center',
                    lineHeight: '26px',
                  }}
                >
                  Please use the following One-Time Password (OTP) to complete
                  your registration. This code is valid for 60 minutes.
                </p>

                {/* OTP Digits */}
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    margin: '32px auto',
                  }}
                >
                  <tbody>
                    <tr>
                      {otp.split('').map((digit, index) => (
                        <td key={index} style={{ padding: '0 6px' }}>
                          <div
                            style={{
                              width: '52px',
                              height: '64px',
                              backgroundColor: '#FBF7FD',
                              border: '2px solid #3E1E60',
                              borderRadius: '8px',
                              display: 'table-cell',
                              verticalAlign: 'middle',
                              textAlign: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontFamily:
                                  '"Saira Stencil One", Monaco, monospace',
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#da4d26',
                              }}
                            >
                              {digit}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center',
                    margin: '0',
                    fontStyle: 'italic',
                  }}
                >
                  If you didn't request this email, you can safely ignore it.
                </p>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td
                style={{
                  backgroundColor: '#FBF7FD',
                  padding: '32px 40px',
                  textAlign: 'center',
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#9ca3af',
                    fontWeight: '600',
                    marginBottom: '8px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Secure &middot; Private &middot; Reliable
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#d1d5db',
                  }}
                >
                  &copy; {new Date().getFullYear()} EasyResPlus. All rights
                  reserved.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};
