allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}

subprojects {
    plugins.withId("com.android.library") {
        val android = extensions.findByName("android")
        if (android != null) {
            try {
                val getNamespace = android.javaClass.getMethod("getNamespace")
                val setNamespace = android.javaClass.getMethod("setNamespace", String::class.java)
                if (getNamespace.invoke(android) == null) {
                    val manifestFile = file("${projectDir}/src/main/AndroidManifest.xml")
                    if (manifestFile.exists()) {
                        val manifestText = manifestFile.readText()
                        val packageMatch = Regex("""package="([^"]+)"""").find(manifestText)
                        if (packageMatch != null) {
                            setNamespace.invoke(android, packageMatch.groupValues[1])
                        } else {
                            setNamespace.invoke(android, "com.example.${name.replace("-", "_")}")
                        }
                    } else {
                        setNamespace.invoke(android, "com.example.${name.replace("-", "_")}")
                    }
                }
            } catch (e: Exception) {
                // Ignore if methods don't exist
            }
        }
    }

    tasks.withType<JavaCompile>().configureEach {
        options.compilerArgs.remove("-Werror")
        options.compilerArgs.add("-Xlint:-options")
    }
}

subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
