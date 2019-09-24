/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author mikes
 */
@Path("shapefiles")
public class ShapefilesResource {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ShapefilesResource
     */
    public ShapefilesResource() {
    }

    /**
     * Retrieves representation of an instance of servlets.ShapefilesResource
     * @return an instance of Response
     */
    @Path("{state}.zip")
    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getXml(@PathParam("state") String state) throws URISyntaxException, IOException {
        URL url = ShapefilesResource.class.getResource("/shapefiles/" + state + ".zip");
        File file = new File(url.toURI());
        byte[] content = Files.readAllBytes(file.toPath());

        return Response
            .ok(content)
            .type("application/zip")
            .header("Content-Disposition", "attachment; filename=\"" + state + "\".zip\"")
            .build();
    }

    /**
     * PUT method for updating or creating an instance of ShapefilesResource
     * @param content representation for the resource
     */
    @PUT
    @Consumes(MediaType.APPLICATION_XML)
    public void putXml(String content) {
    }
}
