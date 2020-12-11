plugins {
    java
    idea
    id("org.springframework.boot") version "2.4.0"
    id("io.spring.dependency-management") version "1.0.10.RELEASE"
    id("io.freefair.lombok") version "5.3.0"
}

group = "com.aleinin"
version = "0.0.1-SNAPSHOT"

java.sourceCompatibility = JavaVersion.VERSION_15

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
    maven("https://jitpack.io")
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.11.3")
    implementation("com.github.husnjak:IGDB-API-JVM:1.0.1")
    implementation("com.google.guava:guava:30.0-jre")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.register("prepareKotlinBuildScriptModel"){

}

tasks.withType<Test> {
    useJUnitPlatform()
}
