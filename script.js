document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth');
    const mainContent = document.getElementById('main-content');
    const navLinks = document.getElementById('nav-links');
    const logoutBtn = document.getElementById('logout-btn');
    const loginForm = document.querySelector('.login-box form');
    const registerForm = document.getElementById('registration-form') || document.querySelector('.register-box form');
    const profileName = document.getElementById('profile-display-name');
    const profileEmail = document.getElementById('profile-display-email');
    const profilePhone = document.getElementById('profile-display-phone');
    const profileDob = document.getElementById('profile-display-dob');
    const profileBlood = document.getElementById('profile-display-blood');
    const profileInitial = document.getElementById('profile-initial');
    const profileSection = document.getElementById('profile'); 
    const loggedInStr = localStorage.getItem('h_logged_in');
    let currentUser = null;
    if(loggedInStr) {
        try {
            currentUser = JSON.parse(loggedInStr);
            authSection.style.display = 'none';
            mainContent.style.display = 'block';
            navLinks.style.display = 'flex';
            navLinks.classList.remove('d-none');
            if(!window.location.hash || window.location.hash === '#auth') {
                window.location.hash = '#home';
            }
        } catch(e) { console.error('LocalStorage error', e); }
    }
    function updateProfileView(user) {
        if(user && profileName) {
            profileName.textContent = user.name;
            if(profileEmail.tagName === 'INPUT') profileEmail.value = user.email; else profileEmail.textContent = user.email;
            if(profilePhone.tagName === 'INPUT') profilePhone.value = user.phone || ''; else profilePhone.textContent = user.phone || '---';
            if(profileDob.tagName === 'INPUT') profileDob.value = user.dob || ''; else profileDob.textContent = user.dob || '---';
            if(profileBlood.tagName === 'INPUT') profileBlood.value = user.blood || ''; else profileBlood.textContent = user.blood || '---';
            profileInitial.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
            if(profileName.contentEditable === "true") {
                profileName.contentEditable = "false";
                profileName.style.borderBottom = "none";
            }
        }
    }
    if(currentUser) updateProfileView(currentUser);   
    if(loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (this.checkValidity()) {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;  
                let users = {};
                try { users = JSON.parse(localStorage.getItem('h_users')) || {}; } catch(err) {}
                let loggedInUser = null;
                if (email === 'harneeshkandasamy@gmail.com' && password === 'harneesh2512') {
                    loggedInUser = { name: 'Guest Student', email: 'h@gmail.com', phone: '(555) 123-4567', dob: '2000-01-01', blood: 'O+' };
                } else if (users[email] && users[email].password === password) {
                    loggedInUser = users[email];
                } else {
                    alert('The credentials that you have entered is invalid');
                    return;
                }
                try {
                    updateProfileView(loggedInUser);
                    localStorage.setItem('h_logged_in', JSON.stringify(loggedInUser));
                    currentUser = loggedInUser;
                } catch(err) {}

                authSection.style.display = 'none';
                mainContent.style.display = 'block';
                navLinks.style.display = 'flex';
                navLinks.classList.remove('d-none');
                window.location.hash = '#home';
                window.scrollTo(0, 0);
                window.dispatchEvent(new Event('hashchange'));
                setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 100);
            }
        });
    }   
    if(registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (this.checkValidity()) {
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const phone = document.getElementById('signup-phone') ? document.getElementById('signup-phone').value : '';
                const dob = document.getElementById('signup-dob') ? document.getElementById('signup-dob').value : '';
                const blood = document.getElementById('signup-blood') ? document.getElementById('signup-blood').value : '';
                const password = document.getElementById('signup-password').value;

                let users = {};
                try { users = JSON.parse(localStorage.getItem('h_users')) || {}; } catch(err) {}              
                if (users[email]) {
                    alert('User already registered with this email. Please login.');
                    return;
                }
                const newUser = { name, email, phone, dob, blood, password };
                users[email] = newUser;
                try {
                    localStorage.setItem('h_users', JSON.stringify(users));
                    localStorage.setItem('h_logged_in', JSON.stringify(newUser));
                } catch(err) {}
                currentUser = newUser;
                alert('Registration successful! Logging you in.');
                try { updateProfileView(newUser); } catch(e){}
                registerForm.reset();              
                authSection.style.display = 'none';
                mainContent.style.display = 'block';
                navLinks.style.display = 'flex';
                navLinks.classList.remove('d-none');
                window.location.hash = '#home';
                window.scrollTo(0, 0);
                window.dispatchEvent(new Event('hashchange'));
                setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 100);
            }
        });
    }
    const btnEditProfile = document.getElementById('btn-edit-profile');
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', function() {
            const inputs = document.querySelectorAll('.profile-input');
            const isEditing = this.innerText === 'Save Profile';
            if (isEditing) {
                this.innerText = 'Edit Profile';
                const userObj = JSON.parse(localStorage.getItem('h_logged_in')) || {};
                userObj.name = document.getElementById('profile-display-name').innerText;
                userObj.email = document.getElementById('profile-display-email').value;
                userObj.phone = document.getElementById('profile-display-phone').value;
                userObj.dob = document.getElementById('profile-display-dob').value;
                userObj.blood = document.getElementById('profile-display-blood').value;              
                inputs.forEach(input => {
                    input.readOnly = true;
                    input.style.borderBottom = 'none';
                    input.style.color = 'var(--text-muted)';
                });          
                localStorage.setItem('h_logged_in', JSON.stringify(userObj));
                const users = JSON.parse(localStorage.getItem('h_users')) || {};
                if(users[userObj.email]) {
                    users[userObj.email] = {...users[userObj.email], ...userObj};
                    localStorage.setItem('h_users', JSON.stringify(users));
                }
                updateProfileView(userObj);
                alert('Profile updated successfully!');
            } else {
                this.innerText = 'Save Profile';
                inputs.forEach(input => {
                    if(input.id !== 'profile-display-email') {
                        input.readOnly = false;
                        input.style.borderBottom = '1px solid var(--primary-color)';
                        input.style.color = 'var(--text-main)';
                    }
                });
                document.getElementById('profile-display-name').contentEditable = true;
                document.getElementById('profile-display-name').style.borderBottom = '1px dashed var(--primary-color)';
                document.getElementById('profile-display-name').focus();
            }
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            authSection.style.display = 'flex';
            mainContent.style.display = 'none';
            navLinks.style.display = 'none';
            navLinks.classList.add('d-none');
            try { localStorage.removeItem('h_logged_in'); } catch(e) {}
            currentUser = null;
            document.querySelectorAll('.form-box form input').forEach(input => {
                if (input.type !== 'radio' && input.type !== 'checkbox' && input.type !== 'submit') {
                    input.value = '';
                }
            });
            window.location.hash = '';
            window.scrollTo(0, 0);
            window.dispatchEvent(new Event('hashchange'));
        });
    }
    const applySection = document.getElementById('apply');
    const paymentSection = document.getElementById('payment');
    const mainSections = ['home', 'about', 'gallery', 'courses', 'contact'].map(id => document.getElementById(id));
    const applyButtons = document.querySelectorAll('.course-card .btn');
    const selectedCourseInput = document.getElementById('selected-course');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const courseName = this.parentElement.querySelector('h3').innerText;
            if(selectedCourseInput) selectedCourseInput.value = courseName;
        });
    });
    const applicationForm = document.getElementById('application-main-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (this.checkValidity()) {
                const course = document.getElementById('selected-course').value || 'General Enrollment';               
                const courseInfoObj = {
                    'B.Tech Engineering': { tuition: 150000, lab: 30000, other: 10000 },
                    'MBA / BBA': { tuition: 200000, lab: 0, activity: 25000, other: 15000 },
                    'BCA / MCA': { tuition: 120000, lab: 20000, other: 10000 },
                    'Mechanical Engineering': { tuition: 150000, lab: 35000, other: 10000 },
                    'Civil Engineering': { tuition: 140000, lab: 25000, other: 10000 },
                    'Artificial Intelligence': { tuition: 200000, lab: 40000, other: 10000 },
                    'General Enrollment': { tuition: 100000, other: 15000 }
                };         
                const fees = courseInfoObj[course] || courseInfoObj['General Enrollment'];             
                document.getElementById('payment-course-name').innerText = `Course: ${course}`;
                const feeList = document.getElementById('payment-fee-list');
                feeList.innerHTML = '';            
                let total = 0;
                feeList.innerHTML += `<li style="display:flex;justify-content:space-between;"><span>Tuition Fee</span> <span>₹${fees.tuition.toLocaleString()}</span></li>`;
                total += fees.tuition;          
                if(fees.lab) {
                    feeList.innerHTML += `<li style="display:flex;justify-content:space-between;"><span>Laboratory Fee</span> <span>₹${fees.lab.toLocaleString()}</span></li>`;
                    total += fees.lab;
                }
                if(fees.activity) {
                    feeList.innerHTML += `<li style="display:flex;justify-content:space-between;"><span>Activity Fee</span> <span>₹${fees.activity.toLocaleString()}</span></li>`;
                    total += fees.activity;
                }
                feeList.innerHTML += `<li style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.1);margin-top:0.5rem;padding-top:0.5rem;"><span>Miscellaneous</span> <span>₹${fees.other.toLocaleString()}</span></li>`;
                total += fees.other;               
                document.getElementById('payment-total-amount').innerText = `₹${total.toLocaleString()}`;
                window.location.hash = '#payment';
            }
        });
    }
    const checkoutForm = document.getElementById('checkout-form');
    if(checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if(this.checkValidity()) {
                alert('Payment successful! Your application has been submitted.');
                window.location.hash = '#profile';
            }
        });
    }
    window.addEventListener('hashchange', function () {
        if (authSection && authSection.style.display !== 'none') return;
        if (window.location.hash === '#apply') {
            mainSections.forEach(sec => { if (sec) sec.style.display = 'none'; });
            if (profileSection) profileSection.style.display = 'none';
            if (paymentSection) paymentSection.style.display = 'none';
            if (applySection) applySection.style.display = 'flex';
            window.scrollTo(0, 0);
        } else if (window.location.hash === '#profile') {
            mainSections.forEach(sec => { if (sec) sec.style.display = 'none'; });
            if (applySection) applySection.style.display = 'none';
            if (paymentSection) paymentSection.style.display = 'none';
            if (profileSection) profileSection.style.display = 'block';
            window.scrollTo(0, 0);
        } else if (window.location.hash === '#payment') {
            mainSections.forEach(sec => { if (sec) sec.style.display = 'none'; });
            if (applySection) applySection.style.display = 'none';
            if (profileSection) profileSection.style.display = 'none';
            if (paymentSection) paymentSection.style.display = 'flex';
            window.scrollTo(0, 0);
        } else {
            if (applySection) applySection.style.display = 'none';
            if (profileSection) profileSection.style.display = 'none';
            if (paymentSection) paymentSection.style.display = 'none';
            mainSections.forEach(sec => { if (sec) sec.style.display = 'flex'; });
        }
        setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 100);
    });
    window.dispatchEvent(new Event('hashchange'));
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn-logout)');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        if (section.id !== 'auth') observer.observe(section);
    });
    window.openGalleryModal = function (modalId) {
        const modal = document.getElementById('gallery-modal');
        const modalBody = document.getElementById('modal-dynamic-body');
        const data = document.getElementById(modalId); 
        if (data && modal && modalBody) {
            modalBody.innerHTML = data.innerHTML;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };   
    window.closeGalleryModal = function () {
        const modal = document.getElementById('gallery-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };   
    const galleryModalElement = document.getElementById('gallery-modal');
    if (galleryModalElement) {
        galleryModalElement.addEventListener('click', function (e) {
            if (e.target === this) {
                closeGalleryModal();
            }
        });
    }
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
            });
        });
    }
});
