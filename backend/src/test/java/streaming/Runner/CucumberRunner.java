package streaming.runner;
 
import org.junit.platform.suite.api.*;
 
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("search.feature")
@ConfigurationParameter(key = "cucumber.glue",          value = "streaming.steps")
@ConfigurationParameter(key = "cucumber.plugin",        value = "pretty,html:target/cucumber-report.html")
@ConfigurationParameter(key = "cucumber.publish.quiet", value = "true")
public class CucumberRunner {
}
 