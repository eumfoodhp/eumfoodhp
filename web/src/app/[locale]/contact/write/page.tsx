import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { supportTabs } from '@/lib/sub-tabs';
import { submitContact } from '../actions';
import '@/styles/sub.css';
import '@/styles/public-forms.css';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main id="sub_contents" className="contact_write_page">
      <div className="sub_inner">
        <form action={submitContact} className="public_form">
          {/* honeypot 봇 차단 — 사람은 안 보임 */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            aria-hidden="true"
          />

          <div className="pf_row">
            <div className="pf_field">
              <label htmlFor="writer_name">{t('contact_write_label_name')} *</label>
              <input id="writer_name" name="writer_name" type="text" required maxLength={50} />
            </div>
            <div className="pf_field">
              <label htmlFor="phone">{t('contact_label_phone')}</label>
              <input id="phone" name="phone" type="tel" placeholder="010-0000-0000" />
            </div>
          </div>

          <div className="pf_field">
            <label htmlFor="email">{t('contact_write_label_email')}</label>
            <input id="email" name="email" type="email" placeholder="example@email.com" />
          </div>

          <div className="pf_field">
            <label htmlFor="subject">{t('contact_label_subject')} *</label>
            <input id="subject" name="subject" type="text" required maxLength={200} />
          </div>

          <div className="pf_field">
            <label htmlFor="content">{t('contact_label_content')} *</label>
            <textarea id="content" name="content" required rows={10} maxLength={5000} />
          </div>

          <label className="pf_checkbox">
            <input type="checkbox" name="is_private" defaultChecked /> {t('contact_private_check')}
          </label>

          <div className="pf_actions">
            <button type="submit" className="pf_submit">{t('contact_submit')}</button>
            <Link href="/contact" className="pf_cancel">{t('contact_cancel')}</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
