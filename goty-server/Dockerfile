FROM adoptopenjdk/openjdk15:alpine-jre
WORKDIR /opt/app
COPY ./build/libs/goty-server-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
