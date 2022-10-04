plugins {
    id("com.gradle.enterprise") version "3.11.1"
    id("com.gradle.common-custom-user-data-gradle-plugin") version "1.8.1"
}

rootProject.name = "goty-server"

gradleEnterprise {
    buildScan {
        publishAlways()

        // By developing this project you implicitly agree to the Gradle Terms of Use.
        termsOfServiceAgree = "yes"
        termsOfServiceUrl = "https://gradle.com/terms-of-service"
    }
}