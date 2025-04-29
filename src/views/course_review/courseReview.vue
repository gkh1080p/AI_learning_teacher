<template>
    <div class="course-review">
        <h1>Course Review</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <h2>{{ course.name }}</h2>
            <p>{{ course.description }}</p>
            <div>
                <h3>Reviews</h3>
                <ul>
                    <li v-for="review in course.reviews" :key="review.id">
                        <strong>{{ review.author }}</strong>: {{ review.content }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CourseReview",
    data() {
        return {
            course: {},
            loading: true,
        };
    },
    created() {
        this.fetchCourseData();
    },
    methods: {
        async fetchCourseData() {
            const courseId = this.$route.params.id;
            try {
                // Simulate API call
                const response = await fetch(`/api/courses/${courseId}`);
                const data = await response.json();
                this.course = data;
            } catch (error) {
                console.error("Failed to fetch course data:", error);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.course-review {
    padding: 20px;
}

h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

h2 {
    font-size: 20px;
    margin-bottom: 10px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
}
</style>
