<footer id="footer">
        <div class="footer_inner">
            <div class="footer_top">
                <div class="f_logo">
                    <img src="/images/common/ftlogo.png" alt="㈜이음푸드시스템">
                </div>
                <div class="f_util">
                    <div class="cert_mark">
                        <img src="/images/common/haccp.png" alt="HACCP">
                    </div>
                    <a href="/admin/login.php" class="admin_link"><?php echo $lang['ft_admin']; ?></a>
                </div>
            </div>

            <div class="footer_bottom">
                <div class="f_info_group">
                    <div class="f_box info_box">
                        <h3>INFO</h3>
                        <div class="f_row">
                            <span><?php echo $lang['ft_ceo']; ?></span>
                            <i class="v_line"></i>
                            <span><?php echo $lang['ft_biz_no']; ?></span>
                        </div>
                        <div class="f_row">
                            <span><?php echo $lang['ft_corp_no']; ?></span>
                        </div>
                    </div>

                    <div class="f_box tel_box">
                        <h3>TEL</h3>
                        <div class="tel_grid">
                            <span><?php echo $lang['ft_tel_quality']; ?></span>
                            <i class="v_line tel_sep" aria-hidden="true"></i>
                            <span><?php echo $lang['ft_tel_sales']; ?></span>
                            <span><?php echo $lang['ft_tel_purchase']; ?></span>
                            <i class="v_line tel_sep" aria-hidden="true"></i>
                            <span><?php echo $lang['ft_tel_dev']; ?></span>
                        </div>
                    </div>

                    <div class="f_box address_box">
                        <h3>ADDRESS</h3>
                        <div class="f_row">
                            <span><?php echo $lang['ft_address']; ?></span>
                        </div>
                    </div>
                </div>

                <p class="copyright"><?php echo $lang['ft_copyright']; ?></p>
            </div>
        </div>
    </footer>
<div class="quick_menu">
    <a href="https://smartstore.naver.com/Eumfood/" target="_blank" class="quick_item mall">
        <div class="icon_box">
            <img src="/images/common/mall.png" alt="<?php echo htmlspecialchars($lang['quick_mall'] ?? 'mall', ENT_QUOTES, 'UTF-8'); ?>">
        </div>
        <span><?php echo htmlspecialchars($lang['quick_mall'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
    </a>

    <a href="/pages/contact_write.php" class="quick_item contact">
        <div class="icon_box">
            <img src="/images/common/talk.png" alt="<?php echo htmlspecialchars($lang['quick_contact'] ?? 'contact', ENT_QUOTES, 'UTF-8'); ?>">
        </div>
        <span><?php echo htmlspecialchars($lang['quick_contact'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
    </a>

    <a href="/data/catalogue.pdf" download class="quick_item catalog">
        <div class="icon_box">
            <img src="/images/common/down.png" alt="<?php echo htmlspecialchars($lang['quick_catalog'] ?? 'catalog', ENT_QUOTES, 'UTF-8'); ?>">
        </div>
        <span><?php echo htmlspecialchars($lang['quick_catalog'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
    </a>

    <button type="button" class="quick_item btn_top" onclick="window.scrollTo({top: 0, behavior: 'smooth'});">
        <img src="/images/common/top.png" alt="<?php echo htmlspecialchars($lang['quick_top'] ?? 'top', ENT_QUOTES, 'UTF-8'); ?>">
    </button>
</div>
    <script src="/js/common.js"></script>
</body>
</html>