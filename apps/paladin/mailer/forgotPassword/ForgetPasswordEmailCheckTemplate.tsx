export function ForgetPasswordEmailCheckTemplate({ otp }: { otp: string }) {
  return (
    <html lang="en" style={{ width: '100%', fontFamily: 'Montserrat' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" />
      </head>
      <body style={{ backgroundColor: '#f6f4fe', margin: 0, padding: 0 }}>
        <table width="100%" role="presentation" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td>
                <table
                  role="presentation"
                  width="640"
                  align="center"
                  style={{
                    background: '#ffffff',
                    margin: '40px auto',
                    padding: 24,
                    color: '#432371',
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <h2 style={{ marginTop: 0 }}>Reset your password</h2>
                        <p>Use the code below to reset your password:</p>
                        <p
                          style={{
                            color: '#f77e40',
                            fontWeight: 700,
                            letterSpacing: '10px',
                            fontSize: '24px',
                          }}
                        >
                          {otp}
                        </p>
                        <p>
                          This code will expire in 60 minutes. If you didn’t
                          request this, ignore this email.
                        </p>
                        <p style={{ marginBottom: 0 }}>Best regards,</p>
                        <p style={{ marginTop: 4, fontWeight: 600 }}>
                          The Team
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
