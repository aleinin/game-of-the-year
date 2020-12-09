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
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.github.husnjak:IGDB-API-JVM:1.0.1")
    implementation("com.google.guava:guava:30.0-jre")
    implementation("org.apache.commons:commons-lang3:3.11")
    implementation("org.apache.lucene:lucene-core:8.7.0")
    implementation("org.apache.lucene:lucene-analyzers-common:8.7.0")
    implementation("org.apache.lucene:lucene-queryparser:8.7.0")
    implementation("org.apache.lucene:lucene-suggest:8.7.0")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.register("prepareKotlinBuildScriptModel"){

}

tasks.withType<Test> {
    useJUnitPlatform()
}
