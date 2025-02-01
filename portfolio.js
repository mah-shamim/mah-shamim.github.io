const data = function () {
    return {
        heading: "", // Initialize heading if required
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
            "projectGroups": {},
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
        googleMap: null,

        init() {
            this.loadGoogleMaps(() => {
                //this.initializeMap();
            });
            return fetch("./data.json")
                .then((response) => response.json())
                .then((data) => {
                    data.certifications = this.resolveCertificates(data.certifications);
                    data.projectGroups = this.resolveProjectGroups(data.projects);
                    data.projects = this.resolveProjects(data.projects);
                    this.user = data;
                    this.$nextTick(() => {
                        this.initCarousels();
                    });
                }).then(() => {
                    this.setTemplate();
                });
        },

        loadGoogleMaps(callback) {
            if (typeof google === "undefined") {
                const script = document.createElement("script");
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAWnZM7AYwXg_PZuM9bNDpf5maU5YFh-Bk`;
                script.async = true;
                script.defer = true;
                script.onload = callback;
                script.onerror = () => {
                    this.mapError = "Failed to load Google Maps. Please check your internet connection.";
                    console.error(this.mapError);
                };
                document.head.appendChild(script);
            } else {
                callback();
            }
        },

        initializeMap() {
            if (this.mapError) {
                console.error(this.mapError);
                return;
            }

            const mapContainer = document.getElementById("map");
            if (mapContainer) {
                try {
                    this.googleMap = new google.maps.Map(mapContainer, {
                        center: { lat: 37.7749, lng: -122.4194 }, // Example location (San Francisco)
                        zoom: 10,
                    });
                } catch (error) {
                    this.mapError = "Failed to initialize Google Maps.";
                    console.error(this.mapError, error);
                }
            }
        },
        initCarousels() {
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
                responsive: { 0: { items: 1 }, 480: { items: 1 }, 768: { items: 2 }, 1200: { items: 2 } },
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

        /*resolveProjectGroups: function (projects) {
            let entries = [];
            projects.forEach((project) => {
                for (group of project.groups) {
                    let slug = this.slugify(group);
                    entries[slug] = group;
                }
            });
            console.log(entries)
            return entries;
        },*/
        resolveProjectGroups(projects) {
            let entries = {}; // Fixed to use an object
            projects.forEach((project) => {
                for (const group of project.groups) { // Fixed `group` declaration
                    let slug = this.slugify(group);
                    entries[slug] = group;
                }
            });
            return entries;
        },

        /*resolveProjects: function (projects) {

            let entries = [];

            projects.forEach((project) => {

                project.slugs = ['all'];

                for (group of project.groups) {
                    project.slugs.push(this.slugify(group));
                }

                entries.push(project);
            });

            return entries;
        },*/

        resolveProjects(projects) {
            let entries = [];
            projects.forEach((project) => {
                project.slugs = ["all"];
                for (const group of project.groups) { // Fixed `group` declaration
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

        /*positionSort: function (a, b) {
            if (a.position < b.position) {
                return -1;
            }
            if (a.position > b.position) {
                return 1;
            }
            return 0;
        },*/
        positionSort(a, b) {
            return a.position - b.position;
        },
        setTemplate: function() {
            document.getElementById('template-style')?.setAttribute('href', this.user.template ?? './css/main-blue.css');
        }
    }
};