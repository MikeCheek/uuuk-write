type EmailComposerState = {
  toName: string
  orderId: string
  shippingName: string
  shippingAddress: string
  ctaUrl: string
  reviewUrl: string
  recipientEmail: string
  actionText?: string
  introText?: string
  footerNote?: string
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const safeMultilineHtml = (value: string): string =>
  escapeHtml(value).replaceAll('\n', '<br />')

export const buildDeliveryCheckEmailHtml = (state: EmailComposerState) => {
  return `<div style="font-family: 'Space Grotesk', Arial, sans-serif; font-size: 14px; color: #d8e5ff; background:#070d1e; background-image: radial-gradient(circle at top left, #142a52 0%, #070d1e 60%); padding:24px 10px;">
  <div style="max-width:640px; margin:0 auto; background: linear-gradient(180deg, #0f1b3c 0%, #0a132d 100%); border:1px solid rgba(255,255,255,0.12); border-radius: 16px; box-shadow: 0 24px 70px rgba(6,10,20,0.55); overflow:hidden;">
    <div style="padding:18px 20px; border-bottom:1px solid rgba(255,255,255,0.10);">
      <a href="https://uuuk.it" target="_blank" style="text-decoration:none;">
        <img src="https://www.uuuk.it/logo.png" alt="logo" height="32" style="height:32px; vertical-align:middle;" />
      </a>
      <span style="font-size:16px; vertical-align:middle; border-left:1px solid rgba(255,255,255,0.25); padding-left:10px; margin-left:10px; color:#f6f8ff;">
        <strong>Il tuo ordine è arrivato?</strong>
      </span>
    </div>

    <div style="padding:28px 20px;">
      <div style="text-align:center; padding-bottom:24px;">
        <div style="display:inline-block; width:64px; height:64px; border-radius:50%; background:rgba(249,115,22,0.10); border:1px solid rgba(255,177,112,0.30); line-height:64px; font-size:30px; margin-bottom:16px;">&#128230;</div>
        <h2 style="margin:0 0 10px; color:#f6f8ff; font-size:20px; font-weight:700;">
          Ciao ${escapeHtml(state.toName)}, è arrivato tutto?
        </h2>
        <p style="margin:0 auto; color:#8ea2d0; font-size:14px; line-height:1.65; max-width:420px;">
          Il tuo ordine <strong style="color:#c4d4ff;">#${escapeHtml(
            state.orderId
          )}</strong> risulta spedito.
          Hai ricevuto il pacco? Faccelo sapere con un click.
        </p>
      </div>

      <div style="margin:0 0 24px; text-align:center;">
        <a href="${escapeHtml(state.ctaUrl)}" target="_blank"
          style="background: linear-gradient(135deg, #f97316, #ff9d57); color:#1e293b; padding:14px 32px; text-decoration:none; border-radius:10px; font-weight:800; text-transform:uppercase; letter-spacing:.03em; display:inline-block; border:1px solid rgba(255,177,112,0.45); font-size:15px;">
          ${escapeHtml(state.actionText || '✓ Sì, ho ricevuto il mio ordine')}
        </a>
      </div>

      <div style="background:#101d3f; border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:14px 16px;">
        <strong style="color:#ffb170; text-transform:uppercase; letter-spacing:.03em; font-size:12px;">Riepilogo ordine</strong>
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:6px 0; color:#8ea2d0; font-size:13px;"><strong>Ordine</strong></td>
            <td style="padding:6px 0; text-align:right; color:#ffffff; font-size:13px;">#${escapeHtml(
              state.orderId
            )}</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:6px 0; color:#8ea2d0; font-size:13px;"><strong>Destinatario</strong></td>
            <td style="padding:6px 0; text-align:right; color:#ffffff; font-size:13px;">${escapeHtml(
              state.shippingName
            )}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#8ea2d0; font-size:13px;"><strong>Indirizzo</strong></td>
            <td style="padding:6px 0; text-align:right; color:#ffffff; font-size:13px;">${escapeHtml(
              state.shippingAddress
            )}</td>
          </tr>
        </table>
      </div>

      ${
        state.introText
          ? `<p style="margin:20px 0 0; color:#8ea2d0; font-size:13px; line-height:1.6;">${safeMultilineHtml(
              state.introText
            )}</p>`
          : ''
      }

      <p style="margin:20px 0 0; color:#5d729e; font-size:12px; text-align:center; line-height:1.6;">
        Quando confermi la ricezione puoi anche lasciare una recensione.
        <a href="${escapeHtml(
          state.reviewUrl
        )}" style="color:#9ad0ff; text-decoration:underline;">Apri la pagina recensione</a>
      </p>
    </div>
  </div>

  <div style="max-width:640px; margin:12px auto 0; color:#8ea2d0; font-size:12px; text-align:left;">
    Email inviata a ${escapeHtml(state.recipientEmail)}<br />
    ${safeMultilineHtml(
      state.footerNote ||
        'Hai ricevuto questa email perché hai completato un ordine su <a href="https://uuuk.it" style="color:#8ea2d0;">uuuk.it</a>.'
    )}
  </div>
</div>`
}
