<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/header.php';
?>

<link rel="stylesheet" href="/css/sub.css">

<main id="sub_contents" class="process_page">
    <section class="sub_visual_section">
        <div class="sub_inner">
            <div class="breadcrumb_wrap">
                <nav class="breadcrumb">
                    <img src="/images/sub/home.png" alt="home" class="home_icon">
                    <i class="dot"></i>
                    <span class="depth1"><?php echo $lang['menu_process']; ?></span>
                    <i class="dot"></i>
                    <span class="depth2 current"><?php echo $lang['sub_proc_salted']; ?></span>
                </nav>
                
                <div class="sub_title_group">
                    <h2 class="sub_page_title"><?php echo $lang['sub_proc_salted']; ?></h2>
                    <p class="sub_page_desc"><?php echo $lang['sub_proc_slogan']; ?></p>
                </div>
            </div>

            <div class="sub_visual_img" style="background-image: url('/images/sub/tempo.png');">
            </div>
        </div>
    </section>

    <section class="process_content_section">
        <div class="process_inner">
            <div class="process_top_info">
                <div class="tit_group">
                    <span class="sub_tit"><?php echo $lang['proc_salted_top_sub']; ?></span>
                    <h3 class="main_tit"><?php echo $lang['proc_salted_top_main']; ?></h3>
                </div>
                <p class="desc_txt">
                    <?php echo nl2br($lang['proc_salted_top_desc']); ?>
                </p>
            </div>

            <div class="step_grid_container">
                <?php
                $step_numbers = ['01', '02', '03', '04', '05'];

                foreach($step_numbers as $num):
                    $tit_key = 'proc_salted_step' . $num . '_tit';
                    $desc_key = 'proc_salted_step' . $num . '_desc';
                ?>
                <div class="step_item">
                    <div class="step_head">
                        <span class="step_badge">Step <?php echo $num; ?></span>
                    </div>
                    <div class="step_info">
                        <h4 class="step_tit"><?php echo $lang[$tit_key]; ?></h4>
                        <p class="step_desc"><?php echo nl2br($lang[$desc_key]); ?></p>
                    </div>
                    <div class="step_img" style="background-image: url('/images/sub/03-<?php echo $num; ?>.png');"></div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is_visible');
                }, (index % 4) * 150);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const stepItems = document.querySelectorAll('.step_item');
    stepItems.forEach(item => { observer.observe(item); });
});
</script>

<?php include_once $_SERVER['DOCUMENT_ROOT'] . '/footer.php'; ?>