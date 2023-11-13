FROM eclipse-temurin:21-jre-alpine
WORKDIR /opt/app
COPY ./build/libs/goty-server-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
