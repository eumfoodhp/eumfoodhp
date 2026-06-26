import { CERTS, certStaticPath, getCertImageMap } from '@/lib/certs';
import { replaceCertImage } from './actions';

export const dynamic = 'force-dynamic';

export default async function CertsAdminPage() {
  const certMap = await getCertImageMap();
  const groups = [
    { title: 'HACCP 인증서', items: CERTS.filter((c) => c.group === 'haccp') },
    { title: '기타 인증', items: CERTS.filter((c) => c.group === 'other') },
    { title: '마크', items: CERTS.filter((c) => c.group === 'mark') },
  ];

  return (
    <>
      <div className="admin_page_header">
        <h2 className="admin_page_title">인증서</h2>
      </div>

      <p className="cert_admin_hint">
        인증서가 갱신되면 해당 항목의 이미지를 교체하세요. 업로드하면 홈페이지에 바로 반영됩니다.
        <br />
        ※ PDF는 이미지(PNG·JPG)로 저장해서 올려주세요.
      </p>

      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <div key={g.title} className="admin_card cert_admin_group">
            <h3 className="cert_admin_group_title">{g.title}</h3>
            <div className="cert_admin_grid">
              {g.items.map((c) => (
                <div key={c.file} className="cert_admin_item">
                  <div className="cert_admin_thumb">
                    <img src={certMap[c.file] ?? certStaticPath(c.file)} alt={c.label} />
                  </div>
                  <p className="cert_admin_label">{c.label}</p>
                  <form action={replaceCertImage} className="cert_admin_form">
                    <input type="hidden" name="file_name" value={c.file} />
                    <input type="file" name="file" accept="image/*" required className="cert_admin_fileinput" />
                    <button type="submit" className="admin_btn">교체</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
}
