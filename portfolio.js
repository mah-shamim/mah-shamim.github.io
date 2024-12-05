const data = function () {
    return {
        loaded: false,
        user: {
            "template": null,
            "userFirstName": "",
            "userLastName": "",
            "userFullName": "",
            "userHeading": [],
            "userTags": [],
            "freelanceAvailable": true,
            "userEmail": "",
            "userAddress": "",
            "userPhoneNumber": "",
            "userIntroduction": "",
            "id": null,
            "resumeId": null,
            "uuid": null,
            "templateId": 1,
            "cvName": "",
            "inReview": false,
            "isShared": false,
            "updatedAfterReview": false,
            "createdAt": "",
            "updatedAt": "",
            "templateUrl": "",
            "awards": [],
            "certifications": {},
            "education": [],
            "work": [],
            "projects": [],
            "projectGroups": [],
            "skills": [],
            "links": [],
            "reviews": [],
            "services": [],
            "clients": [],
            "tools": [],
            "user": {
                "name": "",
                "role": "",
                "photo":"./images/pofile.jpeg",
                "companyName": "",
                "createdAt": "",
                "updatedAt": "",
                "lastNotificationCheck": "",
                "email": "",
                "secondary_emails": [],
                "banners": {}
            }
        },

        init() {
            return fetch("./data.json")
                .then((response) => response.json())
                .then((data) => {
                    data.certifications = this.resolveCertificates(data.certifications);
                    data.projectGroups = this.resolveProjectGroups(data.projects);
                    data.projects = this.resolveProjects(data.projects);
                    this.user = data;
                    this.$nextTick(() => {
                        $('.text-rotation').owlCarousel({
                            loop: true,
                            dots: false,
                            nav: false,
                            margin: 0,
                            items: 1,
                            autoplay: true,
                            autoplayHoverPause: false,
                            autoplayTimeout: 3800,
                            animateOut: 'zoomOut',
                            animateIn: 'zoomIn'
                        });
                        $(".testimonials.owl-carousel").owlCarousel({
                            nav: true,
                            items: 3,
                            loop: false,
                            navText: false,
                            margin: 25,
                            responsive: {0: {items: 1}, 480: {items: 1}, 768: {items: 2}, 1200: {items: 2}},
                            onInitialized: function (event) {
                                // Remove index 0 dynamically
                                $(".testimonials.owl-carousel .owl-item").eq(0).remove();
                                $(".testimonials.owl-carousel").trigger('refresh.owl.carousel');
                            }
                        });
                    });
                }).then(() => {
                    this.setTemplate();
                });
        },

        resolveCertificates: function (certifications) {
            let entries = {};

            certifications.forEach((certificate, index) => {
                if (!entries.hasOwnProperty(certificate.issuedBy)) {
                    entries[certificate.issuedBy] = [];
                }
                entries[certificate.issuedBy].push(certificate);
            });

            for (const issuer in entries) {
                entries[issuer].sort(this.positionSort);
            }

            return entries;
        },

        resolveProjectGroups: function (projects) {
            let entries = [];
            projects.forEach((project) => {
                for (group of project.groups) {
                    let slug = this.slugify(group);
                    entries[slug] = group;
                }
            });
            return entries;
        },

        resolveProjects: function (projects) {

            let entries = [];

            projects.forEach((project) => {

                project.slugs = ['all'];

                for (group of project.groups) {
                    project.slugs.push(this.slugify(group));
                }

                entries.push(project);
            });

            return entries;
        },

        slugify: function (words) {
            return words.toLowerCase().replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
        },

        positionSort: function (a, b) {
            if (a.position < b.position) {
                return -1;
            }
            if (a.position > b.position) {
                return 1;
            }
            return 0;
        },
        setTemplate: function() {
            document.getElementById('template-style')?.setAttribute('href', this.user.template ?? './css/main-blue.css');
        }
    }
};