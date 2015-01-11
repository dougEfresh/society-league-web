package com.society.test;

import com.society.leagues.ServerControl;
import com.society.leagues.client.ApiFactory;
import com.society.leagues.client.api.AuthApi;
import com.society.leagues.client.api.Role;
import com.society.leagues.client.api.domain.TokenResponse;
import com.society.leagues.client.api.domain.User;
import com.society.leagues.conf.DaoConfig;
import com.society.leagues.infrastructure.security.ServiceAuthenticator;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.ws.rs.client.Client;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.sql.DriverManager;

import static org.junit.Assert.assertNotNull;

@Component
public class TestBase {
    public static final String NORMAL_USER = "email_608@domain.com";
    public static final String NORMAL_PASS = "password_608";
    public static final String ADMIN_USER =  "email_528@domain.com";
    public static final String ADMIN_PASS =  "password_528";
    private static Logger logger = LoggerFactory.getLogger(TestBase.class);
    @Autowired ServiceAuthenticator serviceAuthenticator;
    @Autowired ServerControl app;
    @Autowired JdbcTemplate jdbcTemplate;

    AuthApi authApi;
    String baseURL;
    Client client;
    static JdbcTemplate derbyTemplate = DaoConfig.getDerbyTemplate();
    static boolean created = false;

    @BeforeClass
    public static void createDb() throws Exception {
        if (created)
            return;

        final ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
        Resource resource = resourceResolver.getResource("classpath:schema/");
        File dir = resource.getFile();
        if (dir == null)
            throw new RuntimeException("Could not find derby schema in classpath:schema/");
        if (dir.listFiles() == null)
            throw new RuntimeException("No files in classpath:schema/");

        int i = 1;
        while (i <= dir.list().length) {
            for (File file : dir.listFiles()) {
                if (!file.getName().startsWith("0" +i+ "_")) {
                    continue;
                }
                BufferedReader reader = new BufferedReader(new FileReader(file));
                String sql = "";
                String line;
                while ((line = reader.readLine()) != null) {
                    sql += line + "\n";
                }
                logger.info(sql);
                derbyTemplate.update(sql);
            }
            i++;
        }
        created = true;
        createAccounts();
    }

    @AfterClass
    public static void killDb() throws Exception {

    }

    public static void createAccounts() {
        derbyTemplate.update("INSERT INTO users (login,role,passwd)" +
                            " VALUES (?,?,?)",
                    ADMIN_USER, Role.ADMIN.name(),ADMIN_PASS);

        derbyTemplate.update("INSERT INTO users (login,role,passwd) " +
                            "VALUES (?,?,?)",
                    NORMAL_USER, Role.PLAYER.name(), NORMAL_PASS);
    }

    @Before
    public void setup() throws Exception {
        baseURL = "http://localhost:" + app.getPort();
        authApi = ApiFactory.createApi(AuthApi.class, null, baseURL, true);
    }

    public String authenticate(Role role) {
        User user;
        if (Role.isAdmin(role))
            user = new User(ADMIN_USER,ADMIN_PASS);
        else
            user = new User(NORMAL_USER,NORMAL_PASS);

        TokenResponse response = authApi.authenticate(user);
        assertNotNull(response);
        assertNotNull(response.getToken());
        return response.getToken();
    }

}
